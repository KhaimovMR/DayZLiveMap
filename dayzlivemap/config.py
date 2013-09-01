import logging, ConfigParser


class Config(object):
    sections = {
        'rcon': {
            'address': 'localhost',
            'port': 2302,
            'password': 'defaultpassword',
            },
        'map-server': {
            'address': 'localhost',
            'port': 8888,
            'debug': 0,
            'google-api-key': '',
            }
        }
            
    def __init__(self, configFileName):
        config = ConfigParser.RawConfigParser()
        config.read(configFileName)
        
        for sectionName in self.sections:
            section = self.sections[sectionName]
            
            for valueName in section:
                defaultValue = section[valueName]
                
                try:
                    finalValue = config.get(sectionName, valueName)
                    
                    if type(defaultValue) == int:
                        finalValue = int(finalValue)
                    
                    self.sections[sectionName][valueName] = finalValue
                except:
                    logging.info(
                        'Config value "%s" in section "%s" is not defined or wrong. Using default - %s.' % (
                            valueName,
                            sectionName,
                            defaultValue,
                            )
                        )

