from datetime import datetime, time

def is_store_open_auto(jam_operasional_str: str) -> bool:
    try:
        times = jam_operasional_str.replace(" ", "").split("-")
        if len(times) != 2:
            return False
        
        format_jam = "%H:%M"
        open_time = datetime.strptime(times[0], format_jam).time()
        close_time = datetime.strptime(times[1], format_jam).time()
        
        current_time = datetime.now().time()
        
        if open_time <= close_time:
            return open_time <= current_time <= close_time
            return current_time >= open_time or current_time <= close_time
    except Exception:
        return False