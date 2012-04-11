module Guess

  class RedisClient
    PAINT_COUNT = "paints:count"
    PAINTS_HKEYS = ["clickX", "clickY", "clickDrag", "description"]

    class << self

      def client
        Redis.new configuration
      end

      def configuration
        if ENV["VCAP_SERVICES"]
        services = JSON.parse(ENV['VCAP_SERVICES'])
        redis_key = services.keys.select { |svc| svc =~ /redis/i }.first
        redis = services[redis_key].first['credentials']
        {:host => redis['hostname'], :port => redis['port'], :password => redis['password']}
        else
          {}
        end
      end
      memoize(:client, :configuration)

      def paint_count_succ
        client.incr PAINT_COUNT
      end
      
      def paint_key(num)
        "paints:#{num}"
      end

      def paint_name(num) 
        client.hget("paints:#{num}", "name")
      end

      def get_paint(num)
        client.hmget(paint_key(num), *PAINTS_HKEYS)
      end
      
      def init_keys
        client.set(PAINT_COUNT, "0") unless client.exists(PAINT_COUNT)
      end

    end

  end

end

Guess::RedisClient.init_keys

if ENV["VCAP_SERVICES"]
  class Sinatra::Application
    include Guess
  end
end
