Rails.application.routes.draw do
  devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/") 
  root "profiles#edit"

  # ゲストログイン
  post 'guest_sign_in', to: 'guest_sessions#create'
  
  resource :profile, only: [:edit, :update]
  resources :todos, only: [:index, :create, :update, :destroy]

  resources :schedules do
    collection do
      get 'by_date/:date', to: 'schedules#by_date', as: 'by_date'
    end
  end

  resources :posts, only: [:index, :create, :destroy] do
    collection do
      get :my_posts  # 自分の投稿一覧
    end
    
    member do
      post :like
      delete :unlike
    end

    resources :comments, only: [:create, :destroy]
  end

  resources :matches do
    member do
      get 'edit_score'  # スコア編集画面
      patch 'update_score'  # スコア更新
    end
  end
end
