import pandas as pd
from ev_web import model as ev


def make_features(df: pd.DataFrame, freq_maps: dict) -> pd.DataFrame:
    """Wrapper untuk feature preparation yang memanggil logika ev_web.model.prepare."""
    return ev.prepare(df, freq_maps)