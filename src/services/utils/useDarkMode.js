import { useEffect, useState } from 'react';
import { getSunrise, getSunset } from 'sunrise-sunset-js';

export const useDarkMode = () => {
    const [theme, setTheme] = useState('light');
    const [position, setPosition] = useState(false);

    const usePosition = (position) => {
        const sunrise = getSunrise(position.coords.latitude, position.coords.longitude);
        const sunset = getSunset(position.coords.latitude, position.coords.longitude);
        const riseDate = new Date(sunrise).getTime();
        const setDate = new Date(sunset).getTime();
        window.localStorage.setItem('sunrise', riseDate.toString());
        window.localStorage.setItem('sunset', setDate.toString());
    }

    const setMode = mode => {
        window.localStorage.setItem('theme', mode)
        setTheme(mode)
    };

    useEffect(() => {
        if (navigator.geolocation && position) {
            navigator.geolocation.getCurrentPosition(usePosition);
            setPosition(true);
        } else {
            setPosition(false);
        }
    }, [position]);

    useEffect(() => {
        const localTheme = window.localStorage.getItem('theme');
        const risePos = window.localStorage.getItem('sunrise');
        const setPos = window.localStorage.getItem('sunset');
        const currentTime = new Date().getTime();
        let checkSun = null
        if (risePos !== null && setPos !== null) {
            checkSun = currentTime >= parseInt(risePos) && currentTime < parseInt(setPos);
        }
        console.log()

        if (localTheme === 'light' && checkSun) {
            setTheme(localTheme);
        } else if (localTheme === 'dark' && checkSun) {
            setMode('light');
        } else {
            setMode('dark');
        }
    }, []);
    return theme;
};
