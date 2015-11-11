module Wheretocoffee
  class App < Sinatra::Base
    set :public_folder, "public"

    configure do
      enable :cross_origin
    end

    configure :production, :development do
      enable :logging
    end

    get "/" do
      redirect "/index.html"
    end

    options "/v1/venues" do
      response.headers["Access-Control-Allow-Origin"] = "*"
      response.headers["Access-Control-Allow-Methods"] = "POST"

      halt 200
    end

    post "/v1/venues" do
      data = JSON.parse request.body.read
      location = GeoBalancer.new(data["locations"]).perform

      venues = LocationFetcher.new(location).fetch
      venues.to_json
    end
  end
end
