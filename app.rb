#!/usr/bin/env ruby
require 'pry'
require 'sinatra'
require 'sequel'
Sequel::Model.db = Sequel.sqlite
Sequel::Model.db.create_table :notes do
  primary_key :id
  String :title
  String :text
  String :color
end
require 'json'
require './models/note'

get '/' do
  redirect to('/notes')
end

get '/notes' do
  @notes = Note.order(:id).all
  if request.xhr?
    JSON.generate(@notes.map(&:values))
  else
    erb :index
  end
end

put '/notes/:id' do
  note = Note[params[:id]]
  note.update_fields(params, %w(title text color))
  204
end

get '/notes/:id/edit' do
  @notes = Note.order(:id).all
  erb :index
end

post '/notes' do
  new_note = Note.create(params)
  JSON.generate(new_note.values)
end

delete '/notes/:id' do
  Note.where(id: params[:id]).destroy
  204
end
