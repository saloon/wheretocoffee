module Wheretocoffee
  class GeoBalancer
    def initialize(locations)
      @location1 = locations[0]
      @location2 = locations[1]
    end

    def perform
      lat = (@location1["lat"] + @location2["lat"])/2
      lng= (@location1["lng"] + @location2["lng"])/2

      {:lat => lat, :lng => lng}
    end
  end
end
