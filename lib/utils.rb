class Module

  def guess_extension(method)
    if method_defined?(method)
      $stderr.puts "WARNING: Possible confilict with Guess extension:\#{self}##{method} already exists"
    else
      yield if block_given?
    end
  end

end

class Class 

  guess_extension("memoize") do
    def memoize(*args)
      args.each do |name|
        original_method = "_original_#{name}"
        alias_method "#{original_method}", name
        define_method name do
          cache = instance_variable_get("@#{name}")
          if cache
            return cache
          else
            result = send(original_method)
            instance_variable_set("@#{name}", result)
            return result
          end
        end
      end
    end
  end

end

class Object

  guess_extension(:try) do
    def try(*args, &block)
      if args.empty? && block_given?
        yield self
      elsif !args.empty? && !respond_to?(a.first)
        nil
      else
        __send__(*args, &block)
      end
    end
  end

  class NilClass
    def try(*args)
      nil
    end
  end

end
