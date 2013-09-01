# -*- coding: utf-8 -*-
import os
import re
import json
import logging
from datetime import datetime

import tornado.web
import tornado.ioloop

from rconprotocol import BattleyeServer
from config import Config


config = Config('config.ini')


class StaticFile(tornado.web.StaticFileHandler):
    def set_extra_headers(self, path):
        self.set_header("Cache-control", "no-cache, must-revalidate")
        
        
    def get_cache_time(self, path, modified, mime_type):
        return -1
        
        
    def get_modified_time(self):
        return datetime.now()


class DayZLiveMap(tornado.web.Application):
    def __init__(self):
        self.requests = []
        self.regexps = {
            'CreateVehicle': r'',
            }
        self.playersInfo = {}
        self.defaultPlayerInfo = {
            'name': '',
            'coorinates': [0,0],
            'inventory': {'gear': [], 'backpack': []},
            'status': 'online',
            }
        self.staticPath = os.path.abspath('static')
        logging.info('DayZ Live Map started')
        connection = BattleyeServer(
            config.sections['rcon']['address'],
            config.sections['rcon']['port'],
            config.sections['rcon']['password']
            )
        connection.subscribe(DayZLiveMap.extractInfo)
        settings = dict(
                static_path=self.staticPath,
                debug=bool(config.sections['map-server']['debug'])
            )
        urls = [
            ('/map/get-coordinates', GetCoordinatesHandler),
            ('/', MapHandler),
            (r'/(css/.+)', StaticFile, {'path': self.staticPath}),
            (r'/(js/.+)', StaticFile, {'path': self.staticPath}),
            (r'/(images/.*)', StaticFile, {'path': self.staticPath}),
            (r'/(favicon\.png)', StaticFile, {'path': self.staticPath}),
            ('/robots.txt', StaticFile, {'path': self.staticPath + '/robots.txt'}),
            ]
        
        tornado.web.Application.__init__(
            self,
            urls,
            settings
            )

        
    @staticmethod
    def convertCoordinates(x, y):
        return (x/100),(152 - y/100)

        
    @staticmethod
    def extractInfo(data):
        if 'CreateVehicle' in data:
            pass
            
        
class GetCoordinatesHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    def get(self):
        DayZLiveMap.requests.append(self)
    
    
    def on_connection_close(self):
        if self in requests:
            DayZLiveMap.requests.remove(self)
            
        tornado.web.RequestHandler.on_connection_close(self)


class MapHandler(tornado.web.RequestHandler):
    def get(self):
        self.render(os.path.abspath('templates') + '/map.html', googleApiKey=config.sections['map-server']['google-api-key'])
        
        
def run():
    print('DayZ Live Map server is starting...')
    dayzLiveMap = DayZLiveMap()
    dayzLiveMap.listen(
        config.sections['map-server']['port'],
        address=config.sections['map-server']['address'],
        )
    print('...server started successfuly')
    tornado.ioloop.IOLoop.instance().start()
        
if __name__ == '__main__':
    run()
