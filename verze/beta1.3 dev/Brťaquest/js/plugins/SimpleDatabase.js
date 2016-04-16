#========================================================================
# ** Simple Database, by: KilloZapit
#------------------------------------------------------------------------
# This is a simple database script made to load tables form external .txt
# files while also being able to save changed values in saved games.
#
# Table files are (by default) put in a directory under the game's data
# directory called db, but this can be changed by editing the DATABASE_PATH
# constant.
#
# Table files (by default) are simple attribute value pairs sepperated by
# a space. The regex used to parse the values can be changed by changing
# the DATABASE_REGEX constant. Be sure you know what you are doing before
# fiddling with this!
#
# Values will be attempted to be avaluated as ruby values but if there is
# an error they will be assumed to be strings. You can change this by
# changing the ASSUME_STRING constant to false.
#
# To look up a value you can use KZDatabase.get(:table, :attribute) and
# to set one you can use KZDatabase.set(:table, :attribute, value) too.
# All attributes are reffrenced by symbol but the name in the .txt file
# as well as the name of the file should not use the : character.
#========================================================================

#========================================================================
# * Module: KZDatabase - Used for all database functions.
#========================================================================
module KZDatabase
 
  # Config Options
  DATABASE_PATH = "./data/db/"
  DATABASE_REGEX = /\A([^#][^\s]*)\s+(.*)/
  ASSUME_STRING = true
 
  # Initialize module attributes
  @database_defaults = {}
  @database_current = {}
 
  #--------------------------------------------------------------------------
  # * Get data from a table
  #--------------------------------------------------------------------------
  def self.get(table, attribute, default = false)
    unless default
	  attr = @database_current[table][attribute] rescue nil
	  return attr if attr
    end
    unless @database_defaults[table]
	  hash={}
	  filename = DATABASE_PATH+table.to_s+".txt"
	  if File.exists?(filename)
	    lines = File.readlines(filename)
	    for l in lines
		  if l =~ DATABASE_REGEX
		    begin
			  value = eval($2)
		    rescue
			  if ASSUME_STRING
			    puts('Trouble parseing: "'+ $2 + '", string value assumed.')
			    value = $2
			  else
			    raise
			  end
		    end
		    hash[$1.to_sym] = value
		  end
	    end
	  end
	  @database_defaults[table]=hash
    end
    return @database_defaults[table][attribute]
  end
 
  #--------------------------------------------------------------------------
  # * Set data to be saved
  #--------------------------------------------------------------------------
  def self.set(table, attribute, value)
    (@database_current[table] ||= {})[attribute] = value
  end
 
  #--------------------------------------------------------------------------
  # * Returns current saved data
  #--------------------------------------------------------------------------
  def self.database_current
    @database_current
  end
 
  #--------------------------------------------------------------------------
  # * Sets current saved data
  #--------------------------------------------------------------------------
  def self.database_current=(value)
    @database_current = value || {}
  end
 
end

#========================================================================
# * Module: DataManager - Handles saved games.
#========================================================================
module DataManager
 
  #--------------------------------------------------------------------------
  # * Create Game Objects
  #--------------------------------------------------------------------------
  class << self
    alias create_game_objects_tablelist_base create_game_objects
  end
  def self.create_game_objects
    create_game_objects_tablelist_base
    KZDatabase.database_current = {}
  end
  #--------------------------------------------------------------------------
  # * Create Save Contents
  #--------------------------------------------------------------------------
  class << self
    alias make_save_contents_tablelist_base make_save_contents
  end
  def self.make_save_contents
    contents = make_save_contents_tablelist_base
    contents[:tablelist] = KZDatabase.database_current
    contents
  end
  #--------------------------------------------------------------------------
  # * Extract Save Contents
  #--------------------------------------------------------------------------
  class << self
    alias extract_save_contents_tablelist_base extract_save_contents
  end
  def self.extract_save_contents(contents)
    extract_save_contents_tablelist_base(contents)
    KZDatabase.database_current = contents[:tablelist]
  end

end