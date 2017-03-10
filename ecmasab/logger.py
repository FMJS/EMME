import sys

class Logger(object):
    verbosity = 0
    
    def __init__(self, verbosity):
        self.verbosity = verbosity

    def msg(self, msg, level):
        if self.verbosity > level: 
            sys.stdout.write(msg)
            sys.stdout.flush()

    def log(self, msg, level):
        if self.verbosity > level: 
            sys.stdout.write(msg+"\n")
            sys.stdout.flush()
            
