import sys
import time

class Logger(object):
    verbosity = 0
    id_timer = 0
    timers = []
    
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

    @staticmethod        
    def error(msg):
        sys.stderr.write(msg+"\n")
        sys.stderr.flush()
            
    @staticmethod        
    def level(level):
        return Logger.verbosity > level

    @staticmethod        
    def start_timer():
        Logger.timers.append(time.time())
        Logger.id_timer += 1
        return Logger.id_timer-1
    
    @staticmethod        
    def stop_timer(id_timer):
        return time.time() - Logger.timers[id_timer]
