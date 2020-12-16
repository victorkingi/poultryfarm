import { useEffect, useState } from 'react';
import { getSunrise, getSunset } from 'sunrise-sunset-js';

export const useDarkMode = () => {
    const [theme, setTheme] = useState('light');

    const usePosition = (position) => {
        const sunrise = getSunrise(position.coords.latitude, position.coords.longitude);
        const sunset = getSunset(position.coords.latitude, position.coords.longitude);
        const riseDate = new Date(sunrise).getTime();
        const setDate = new Date(sunset).getTime();
        window.localStorage.setItem('sunrise', riseDate.toString());
        window.localStorage.setItem('sunset', setDate.toString());
    }

    const setMode = mode => {
        setTheme(mode)
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(usePosition);
        }
    }, []);

    useEffect(() => {
        const risePos = window.localStorage.getItem('sunrise');
        const setPos = window.localStorage.getItem('sunset');
        const currentTime = new Date().getTime();
        let checkSun = false
        if (risePos !== null && setPos !== null) {
            checkSun = currentTime >= parseInt(risePos) && currentTime < parseInt(setPos);
        }

        if (!checkSun) {
            setMode('dark');
        }
    }, []);
    return theme;
};
