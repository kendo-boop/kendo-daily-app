class PostsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_post, only: [:destroy, :like, :unlike]
  before_action :authorize_user!, only: [:destroy]
  
  def index
    @posts = Post.includes(:user, :liked_users, :comments, media_file_attachment: :blob)  # ← 単数形に修正
                 .recent
                 .page(params[:page])
                 .per(10)
    @post = Post.new
  end
  
  def my_posts
    @posts = current_user.posts
                         .includes(:user, :liked_users, :comments, media_file_attachment: :blob)  # ← 単数形に修正
                         .recent
                         .page(params[:page])
                         .per(10)
    @post = Post.new
    render :index
  end
  
  def create
    @post = current_user.posts.build(post_params)
    
    if @post.save
      redirect_to posts_path, notice: '投稿しました'
    else
      @posts = Post.includes(:user, :liked_users, :comments, media_file_attachment: :blob).recent.page(params[:page]).per(20)  # ← 修正
      flash.now[:alert] = @post.errors.full_messages.join(', ')
      render :index
    end
  end
  
  def destroy
    @post.destroy
    redirect_to posts_path, notice: '投稿を削除しました'
  end
  
  def like
    @like = current_user.likes.build(post: @post)
    
    if @like.save
      respond_to do |format|
        format.html { redirect_to posts_path }
        format.js
      end
    else
      redirect_to posts_path, alert: 'いいねできませんでした'
    end
  end
  
  def unlike
    @like = current_user.likes.find_by(post: @post)
    
    if @like&.destroy
      respond_to do |format|
        format.html { redirect_to posts_path }
        format.js
      end
    else
      redirect_to posts_path, alert: 'いいね解除できませんでした'
    end
  end
  
  private
  
  def set_post
    @post = Post.find(params[:id])
  end
  
  def authorize_user!
    unless @post.user == current_user
      redirect_to posts_path, alert: '権限がありません'
    end
  end
  
  def post_params
    params.require(:post).permit(:content, :media_file) 
  end
end