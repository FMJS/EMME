import sys

class Logger(object):
    verbosity = 0
    
    @staticmethod        
    def msg(msg, level, condition=True):
        if (Logger.verbosity > level) and (condition):
            sys.stdout.write(msg)
            sys.stdout.flush()

    @staticmethod        
    def log(msg, level, condition=True):
        if (Logger.verbosity > level) and (condition): 
            sys.stdout.write(msg+"\n")
            sys.stdout.flush()
            
