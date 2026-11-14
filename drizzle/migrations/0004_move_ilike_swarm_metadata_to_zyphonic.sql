UPDATE public.stations
SET now_playing_api = 'https://stream.zyphonic.co.uk/api/station/ilikeradio/nowplaying',
    schedule_api = 'https://stream.zyphonic.co.uk/api/station/ilikeradio/schedule?rows=48',
    request_url = 'https://zyphonic.co.uk/player'
WHERE id = 2 AND name = 'ilikeRadio';

UPDATE public.stations
SET now_playing_api = 'https://stream.zyphonic.co.uk/api/station/swarm/nowplaying',
    schedule_api = 'https://stream.zyphonic.co.uk/api/station/swarm/schedule?rows=48'
WHERE id = 3 AND name = 'Swarm Radio';