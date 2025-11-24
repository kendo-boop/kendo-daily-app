class SchedulesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_schedule, only: [ :edit, :update, :destroy ]

  def index
    @year = params[:year]&.to_i || Date.today.year
    @month = params[:month]&.to_i || Date.today.month

    # 選択された日付(デフォルトは今日)
    @selected_date = if params[:date].present?
                       Date.parse(params[:date])
    else
                       Date.today
    end

    # カレンダー表示用の月のスケジュール
    @month_schedules = current_user.schedules.for_month(@year, @month)

    # 選択された日のスケジュール
    @day_schedules = current_user.schedules.for_date(@selected_date).ordered

    # 新規作成用
    @schedule = Schedule.new
  end

  def by_date
    date = Date.parse(params[:date])
    @schedules = current_user.schedules.for_date(date).ordered

    render json: {
      date: date.strftime("%Y年%-m月%-d日(#{%w[日 月 火 水 木 金 土][date.wday]})"),
      schedules: @schedules.map { |s| schedule_json(s) }
    }
  rescue ArgumentError
    render json: { error: "無効な日付です" }, status: :bad_request
  end

  def create
    @schedule = current_user.schedules.build

    # 日付と時刻を結合
    schedule_date = Date.parse(params[:schedule][:schedule_date])
    start_time_str = params[:schedule][:start_time_only]
    end_time_str = params[:schedule][:end_time_only]

    @schedule.start_time = Time.zone.parse("#{schedule_date} #{start_time_str}")
    @schedule.end_time = Time.zone.parse("#{schedule_date} #{end_time_str}")
    @schedule.title = params[:schedule][:title]
    @schedule.location = params[:schedule][:location]
    @schedule.category = params[:schedule][:category]
    @schedule.memo = params[:schedule][:memo]

    if @schedule.save
      # 年月も一緒に渡す
      redirect_to schedules_path(
        year: schedule_date.year,
        month: schedule_date.month,
        date: schedule_date
      ), notice: "スケジュールを追加しました"
    else
      @year = schedule_date.year
      @month = schedule_date.month
      @selected_date = schedule_date
      @month_schedules = current_user.schedules.for_month(@year, @month)
      @day_schedules = current_user.schedules.for_date(@selected_date).ordered
      render :index
    end
  end

  def update
    schedule_date = Date.parse(params[:schedule][:schedule_date])
    start_time_str = params[:schedule][:start_time_only]
    end_time_str = params[:schedule][:end_time_only]

    @schedule.start_time = Time.zone.parse("#{schedule_date} #{start_time_str}")
    @schedule.end_time = Time.zone.parse("#{schedule_date} #{end_time_str}")
    @schedule.title = params[:schedule][:title]
    @schedule.location = params[:schedule][:location]
    @schedule.category = params[:schedule][:category]
    @schedule.memo = params[:schedule][:memo]

    if @schedule.save
      # updateも同様に修正
      redirect_to schedules_path(
        year: schedule_date.year,
        month: schedule_date.month,
        date: schedule_date
      ), notice: "スケジュールを更新しました"
    else
      render :edit
    end
  end

  def edit
    # 編集ページを表示(今は使わないけど将来のために)
  end

  def destroy
    date = @schedule.start_time.to_date
    @schedule.destroy
    redirect_to schedules_path(date: date), notice: "スケジュールを削除しました"
  end

  private

  def set_schedule
    @schedule = current_user.schedules.find(params[:id])
  end

  def schedule_params
    params.require(:schedule).permit(:title, :start_time, :end_time, :location, :category, :memo)
  end

  def schedule_json(schedule)
    {
      id: schedule.id,
      title: schedule.title,
      start_time: schedule.start_time.strftime("%H:%M"),
      end_time: schedule.end_time.strftime("%H:%M"),
      location: schedule.location,
      category: schedule.category,
      memo: schedule.memo
    }
  end

  def parse_time(time_string)
    return 0 unless time_string.present?
    hours, minutes = time_string.split(":").map(&:to_i)
    hours.hours + minutes.minutes
  end
end
