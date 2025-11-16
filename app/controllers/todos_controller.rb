class TodosController < ApplicationController
  before_action :authenticate_user!
  before_action :set_todo, only: [:update, :destroy]

  def index
    @todos = current_user.todos.ordered
    @todo = Todo.new
  end

  def create
    @todo = current_user.todos.build(todo_params)
    
    if @todo.save
      redirect_to todos_path, notice: "TODOを追加しました。"
    else
      @todos = current_user.todos.ordered
      render :index, status: :unprocessable_entity
    end
  end

  def update
    if @todo.update(todo_params)
      redirect_to todos_path, notice: "TODOを更新しました。"
    else
      redirect_to todos_path, alert: "更新に失敗しました。"
    end
  end

  def destroy
    @todo.destroy
    redirect_to todos_path, notice: "TODOを削除しました。"
  end

  private

  def set_todo
    @todo = current_user.todos.find(params[:id])
  end

  def todo_params
    params.require(:todo).permit(:title, :completed, :priority, :category, :due_date)
  end
end
