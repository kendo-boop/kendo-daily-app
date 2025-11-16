class CommentsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_post
  before_action :set_comment, only: [:destroy]
  before_action :authorize_user!, only: [:destroy]
  
  def create
    @comment = @post.comments.build(comment_params)
    @comment.user = current_user
    
    if @comment.save
      respond_to do |format|
        format.html { redirect_to posts_path, notice: 'コメントを投稿しました' }
        format.js
      end
    else
      respond_to do |format|
        format.html { redirect_to posts_path, alert: 'コメントを投稿できませんでした' }
        format.js { render :error }
      end
    end
  end
  
  def destroy
    @comment.destroy
    respond_to do |format|
      format.html { redirect_to posts_path, notice: 'コメントを削除しました' }
      format.js
    end
  end
  
  private
  
  def set_post
    @post = Post.find(params[:post_id])
  end
  
  def set_comment
    @comment = @post.comments.find(params[:id])
  end
  
  def authorize_user!
    unless @comment.user == current_user
      redirect_to posts_path, alert: '権限がありません'
    end
  end
  
  def comment_params
    params.require(:comment).permit(:content)
  end
end