#require 'sinatra' #required for framework detection in cloud foundry
require 'rubygems'
require "bundler"
Bundler.require

require './lib/utils'
require './lib/guess_redis'
require './lib/chrome_frame'

use Rack::GoogleAnalytics, :web_property_id => "UA-30753861-1"
use Rack::ChromeFrame

set :public_folder, File.dirname(__FILE__) + '/public'
set :views, File.dirname(__FILE__) + '/app/views'

get '/' do
  @title = "Paint Picture"
  erb :index
end

get '/paints/:id' do
  paint_data = Guess::RedisClient.get_paint(params[:id])
  if paint_data
    @title = "Guess Picture"
    @clickx, @clicky, @clickdrag, @description = *paint_data
    erb :index
  else
    redirect "/" , 303
  end
end

post '/paints' do
  count = Guess::RedisClient.paint_count_succ
  paint_key = Guess::RedisClient.paint_key count
  Guess::RedisClient.client.hmset(paint_key, *params.to_a.flatten)
  "#{env['HTTP_HOST']}/paints/#{count}"
end

post '/paints/:id/guess' do
  (Guess::RedisClient.paint_name(params[:id]) == params[:name]).inspect
end
