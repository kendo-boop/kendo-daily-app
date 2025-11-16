# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_11_09_165515) do
  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "comments", force: :cascade do |t|
    t.text "content", null: false
    t.integer "user_id", null: false
    t.integer "post_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_at"], name: "index_comments_on_created_at"
    t.index ["post_id"], name: "index_comments_on_post_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "individual_scores", force: :cascade do |t|
    t.integer "match_id", null: false
    t.string "my_name", null: false
    t.string "opponent_name", default: ""
    t.boolean "is_encho", default: false
    t.string "result", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "points_history"
    t.boolean "is_fusenshow", default: false
    t.integer "hansoku_count_my", default: 0
    t.integer "hansoku_count_opponent", default: 0
    t.boolean "is_hantei", default: false
    t.boolean "is_draw", default: false
    t.string "my_team_name"
    t.string "opponent_team_name"
    t.index ["match_id"], name: "index_individual_scores_on_match_id"
  end

  create_table "likes", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "post_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["post_id"], name: "index_likes_on_post_id"
    t.index ["user_id", "post_id"], name: "index_likes_on_user_id_and_post_id", unique: true
    t.index ["user_id"], name: "index_likes_on_user_id"
  end

  create_table "matches", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "match_type", null: false
    t.string "title", null: false
    t.date "match_date", null: false
    t.string "location"
    t.text "memo"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "match_date"], name: "index_matches_on_user_id_and_match_date"
    t.index ["user_id"], name: "index_matches_on_user_id"
  end

  create_table "posts", force: :cascade do |t|
    t.text "content", null: false
    t.integer "user_id", null: false
    t.integer "likes_count", default: 0, null: false
    t.integer "comments_count", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_at"], name: "index_posts_on_created_at"
    t.index ["user_id"], name: "index_posts_on_user_id"
  end

  create_table "profiles", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "name"
    t.text "bio"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_profiles_on_user_id"
  end

  create_table "schedules", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "title", null: false
    t.datetime "start_time", null: false
    t.datetime "end_time", null: false
    t.string "location"
    t.string "category"
    t.text "memo"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "start_time"], name: "index_schedules_on_user_id_and_start_time"
    t.index ["user_id"], name: "index_schedules_on_user_id"
  end

  create_table "team_members", force: :cascade do |t|
    t.integer "team_score_id", null: false
    t.string "position", null: false
    t.string "my_member_name", default: ""
    t.string "opponent_member_name", default: ""
    t.boolean "is_encho", default: false
    t.boolean "is_draw", default: false
    t.string "result"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "points_history"
    t.boolean "is_fusenshow", default: false
    t.integer "hansoku_count_my", default: 0
    t.integer "hansoku_count_opponent", default: 0
    t.boolean "is_hantei", default: false
    t.index ["team_score_id", "position"], name: "index_team_members_on_team_score_id_and_position"
    t.index ["team_score_id"], name: "index_team_members_on_team_score_id"
  end

  create_table "team_scores", force: :cascade do |t|
    t.integer "match_id", null: false
    t.string "my_team_name", default: ""
    t.string "opponent_team_name", default: ""
    t.string "result", null: false
    t.boolean "has_daihyosen", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["match_id"], name: "index_team_scores_on_match_id"
  end

  create_table "todos", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "title", null: false
    t.boolean "completed", default: false, null: false
    t.integer "priority", default: 0
    t.string "category"
    t.date "due_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "completed"], name: "index_todos_on_user_id_and_completed"
    t.index ["user_id"], name: "index_todos_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "comments", "posts"
  add_foreign_key "comments", "users"
  add_foreign_key "individual_scores", "matches"
  add_foreign_key "likes", "posts"
  add_foreign_key "likes", "users"
  add_foreign_key "matches", "users"
  add_foreign_key "posts", "users"
  add_foreign_key "profiles", "users"
  add_foreign_key "schedules", "users"
  add_foreign_key "team_members", "team_scores"
  add_foreign_key "team_scores", "matches"
  add_foreign_key "todos", "users"
end
