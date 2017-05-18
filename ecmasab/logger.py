import sys

class Logger(object):
    verbosity = 0
    
    @staticmethod        
    def msg(msg, level):
        if Logger.verbosity > level: 
            sys.stdout.write(msg)
            sys.stdout.flush()

    @staticmethod        
    def log(msg, level):
        if Logger.verbosity > level: 
            sys.stdout.write(msg+"\n")
            sys.stdout.flush()
            
