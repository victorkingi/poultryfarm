import React from "react";
import {Line} from "react-chartjs-2";

function EachWeekly({eggs}) {

    const eggDataWeeklyCagePercent = [];
    const eggDataWeeklyHousePercent = [];

    const eggsLabelWeeklyPercent = [];

    let percentMax = 0;

    if (eggs) {
        for (let i = 0; i < eggs['length']; i++) {

            const weeklyCagePercent = parseInt(eggs[i.toString()]["weeklyCagePercent"]);
            const weeklyHousePercent = parseInt(eggs[i.toString()]["weeklyHousePercent"]);

            if (!isNaN(weeklyCagePercent)) {
                const myDate = eggs[i.toString()].date.toDate().toLocaleDateString();
                eggsLabelWeeklyPercent.push(myDate);
            }

            if (percentMax < weeklyCagePercent) {
                percentMax = weeklyCagePercent;
            }

            if (!isNaN(weeklyCagePercent)) {
                eggDataWeeklyCagePercent.push(weeklyCagePercent);
            }
            if (!isNaN(weeklyHousePercent)) {
                eggDataWeeklyHousePercent.push(weeklyHousePercent);
            }
        }

        const eggDataWeeklyCagePercentn = eggDataWeeklyCagePercent.reverse();
        const eggDataWeeklyHousePercentn = eggDataWeeklyHousePercent.reverse();

        const eggLabelWeeklyPercentn = eggsLabelWeeklyPercent.reverse();

        const weeklyPercentage = {
            labels: eggLabelWeeklyPercentn,
            datasets: [
                {
                    label: 'Caged Weekly percentage',
                    data: eggDataWeeklyCagePercentn,
                    borderColor: ['rgba(0, 0, 255, 0.2)'],
                    backgroundColor: ['rgba(0, 0, 255, 0.2)'],
                    pointBackgroundColor: 'rgba(0, 0, 255, 0.2)'
                },
                {
                    label: 'House Weekly Percentage',
                    data: eggDataWeeklyHousePercentn,
                    borderColor: ['rgba(255, 69, 0, 0.2)'],
                    backgroundColor: ['rgba(255, 69, 0, 0.2)'],
                    pointBackgroundColor: 'rgba(255, 69, 0, 0.2)'
                }
            ]
        }

        const weeklyPercentOption = {
            title: {
                display: true,
                fontSize: 20,
                fontColor: '#000000',
                text: 'Weekly Laying Percentage'
            },
            legend: {
                labels: {
                    fontSize: 15,
                    fontColor: '#000000'
                }
            },
            scales: {
                yAxes: [
                    {
                        ticks: {
                            min: 0,
                            max: percentMax,
                            stepSize: 20
                        }
                    }
                ]
            }
        }

        return (
            <Line data={weeklyPercentage} options={weeklyPercentOption}/>
        );
    } else {
        return (
            <div/>
        )
    }
}

export default EachWeekly;