class MatchesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_match, only: [ :destroy, :edit_score, :update_score ]

  # GET /matches
  def index
    @matches = current_user.matches.recent.includes(:individual_score, team_score: :team_members)
  end

  # GET /matches/new
  def new
    @match = current_user.matches.build(match_date: Date.today)
  end

  # POST /matches
  def create
    @match = current_user.matches.build(match_params)

    if @match.save
      # 試合タイプに応じてスコアレコードを作成
      if @match.individual?
        @match.create_individual_score!(
          my_name: current_user.profile&.name || "あなた",
          opponent_name: "",
          result: "win",
          points_history: []
        )
      else
        team_score = @match.create_team_score!(
          my_team_name: "",
          opponent_team_name: "",
          result: "win",
          has_daihyosen: false
        )

        # 5人分のメンバーを作成
        [ "senpo", "jiho", "chuken", "fukusho", "taisho" ].each do |position|
          team_score.team_members.create!(
            position: position,
            my_member_name: "",
            opponent_member_name: "",
            points_history: [],
            result: "draw"
          )
        end
      end

      redirect_to edit_score_match_path(@match), notice: "試合を作成しました"
    else
      render :new, status: :unprocessable_entity
    end
  end

  # GET /matches/:id/edit_score
  def edit_score
    if @match.individual?
      @score = @match.individual_score
    else
      @score = @match.team_score
      # ポジション順にソート（代表戦を除く通常の5人）
      @team_members = @score.team_members.where.not(position: "daihyosen").sort_by { |m|
        [ "senpo", "jiho", "chuken", "fukusho", "taisho" ].index(m.position) || 999
      }
      # 代表戦メンバーも取得
      @daihyosen_member = @score.team_members.find_by(position: "daihyosen")
    end
  end

  # PATCH /matches/:id/update_score
  def update_score
    # まず試合情報を更新
    match_update_params = params[:match]&.permit(:title, :match_date)
    @match.update(match_update_params) if match_update_params.present?

    success = if @match.individual?
      update_individual_score
    else
      update_team_score
    end

    respond_to do |format|
      if success
        format.html { redirect_to matches_path, notice: "試合結果を保存しました" }
        format.json { render json: { success: true, message: "保存しました" } }
      else
        format.html {
          @score = @match.team? ? @match.team_score : @match.individual_score
          @team_members = @match.team_score.team_members.where.not(position: "daihyosen").order(:position) if @match.team?
          render :edit_score, status: :unprocessable_entity
        }
        format.json {
          errors = []
          errors += @match.errors.full_messages if @match.errors.any?

          if @match.team? && @match.team_score
            errors += @match.team_score.errors.full_messages if @match.team_score.errors.any?
            @match.team_score.team_members.each do |member|
              errors += member.errors.full_messages if member.errors.any?
            end
          end

          Rails.logger.error "Save failed with errors: #{errors.join(', ')}"
          render json: { success: false, errors: errors }, status: :unprocessable_entity
        }
      end
    end
  end

  # DELETE /matches/:id
  def destroy
    @match.destroy
    redirect_to matches_path, notice: "試合を削除しました"
  end

  private

  def set_match
    @match = current_user.matches.find(params[:id])
  end

  def match_params
    params.require(:match).permit(:match_type, :title, :match_date, :location, :memo)
  end

  def update_individual_score
    score_params = params[:individual_score]&.permit(
      :my_name, :my_team_name, :opponent_name, :opponent_team_name,
      :result, :is_encho, :is_fusenshow, :is_hantei, :is_draw,
      :hansoku_count_my, :hansoku_count_opponent
    )

    return false unless score_params.present?

    # points_history を JSON 文字列として処理
    if params[:individual_score][:points_history].is_a?(String)
      score_params[:points_history] = params[:individual_score][:points_history]
    elsif params[:individual_score][:points_history].is_a?(Array)
      score_params[:points_history] = params[:individual_score][:points_history].to_json
    end

    @match.individual_score.update(score_params)
  end

  def update_team_score
    begin
      ActiveRecord::Base.transaction do
        # team_score の基本情報を更新
        score_params = params[:team_score]&.permit(
          :my_team_name, :opponent_team_name, :result, :has_daihyosen
        )

        unless score_params.present?
          Rails.logger.error "score_params is blank"
          raise ActiveRecord::Rollback
        end

        # team_members の更新
        if params[:team_score][:team_members_attributes].present?
          params[:team_score][:team_members_attributes].each do |member_params|
            # 既存メンバーの更新
            if member_params[:id].present?
              member = @match.team_score.team_members.find_by(id: member_params[:id])

              unless member
                Rails.logger.error "TeamMember not found: #{member_params[:id]}"
                raise ActiveRecord::Rollback
              end

              update_member(member, member_params)
            else
              # 新規メンバー（代表戦）の作成
              if member_params[:position] == "daihyosen"
                # 既存の代表戦メンバーを確認
                existing_daihyosen = @match.team_score.team_members.find_by(position: "daihyosen")

                if existing_daihyosen
                  # 既存の代表戦を更新
                  update_member(existing_daihyosen, member_params)
                else
                  # 新規作成
                  member = @match.team_score.team_members.build(position: "daihyosen")
                  update_member(member, member_params)
                end
              end
            end
          end
        end

        # 代表戦が削除された場合の処理
        if score_params[:has_daihyosen] == false
          @match.team_score.team_members.where(position: "daihyosen").destroy_all
        end

        # team_score を更新
        unless @match.team_score.update(score_params)
          Rails.logger.error "TeamScore update failed: #{@match.team_score.errors.full_messages.join(', ')}"
          raise ActiveRecord::Rollback
        end

        Rails.logger.info "Update successful!"
        return true
      end

      # トランザクションがRollbackされた場合
      Rails.logger.error "Transaction was rolled back"
      false

    rescue => e
      Rails.logger.error "Update error: #{e.class} - #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      false
    end
  end

  def update_member(member, member_params)
    # points_historyを直接設定
    points_history_value = member_params[:points_history]

    # すでにJSON文字列の場合はそのまま、配列の場合はJSON化
    if points_history_value.is_a?(String)
      points_history_json = points_history_value
    elsif points_history_value.is_a?(Array)
      points_history_json = points_history_value.to_json
    else
      points_history_json = [].to_json
    end

    Rails.logger.info "Updating member #{member.id || 'new'} (#{member_params[:position]}) with points_history: #{points_history_json}"

    # 直接updateで更新
    unless member.update(
      my_member_name: member_params[:my_member_name] || "",
      opponent_member_name: member_params[:opponent_member_name] || "",
      result: member_params[:result] || "draw",
      is_encho: member_params[:is_encho] || false,
      is_draw: member_params[:is_draw] || false,
      is_fusenshow: member_params[:is_fusenshow] || false,
      is_hantei: member_params[:is_hantei] || false,
      hansoku_count_my: member_params[:hansoku_count_my] || 0,
      hansoku_count_opponent: member_params[:hansoku_count_opponent] || 0,
      points_history: points_history_json
    )
      Rails.logger.error "TeamMember update failed for member #{member.id || 'new'}: #{member.errors.full_messages.join(', ')}"
      raise ActiveRecord::Rollback
    end
  end
end
