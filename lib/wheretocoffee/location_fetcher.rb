module Wheretocoffee
  class LocationFetcher
    COFFEE_SHOP_CATEGORY_ID = "4bf58dd8d48988d1e0931735"

    def initialize(location)
      @location = location
    end

    def fetch
      foursquare.search_venues({
        ll: latlng,
        categoryId: COFFEE_SHOP_CATEGORY_ID,
        radius: 500,
        limit: 5
      })
    end

    def latlng
      "#{@location[:lat]}, #{@location[:lng]}"
    end

    private

    def foursquare
      @foursquare ||= Foursquare2::Client.new({
        client_id: ENV["FOURSQUARE_CLIENT_ID"],
        client_secret: ENV["FOURSQUARE_CLIENT_SECRET"],
        api_version: "20120609"
      })
    end
  end
end
