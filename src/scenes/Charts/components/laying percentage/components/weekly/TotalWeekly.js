import React from "react";
import {Line} from "react-chartjs-2";

function TotalWeekly({eggs}) {

    const eggDataWeeklyAllPercent = [];

    const eggsLabelWeeklyPercent = [];

    let percentMax = 0;

    if (eggs) {
        for (let i = 0; i < eggs['length']; i++) {

            const weeklyAllPercent = parseInt(eggs[i.toString()]["weeklyAllPercent"]);

            if (!isNaN(weeklyAllPercent)) {
                const myDate = eggs[i.toString()].date.toDate().toLocaleDateString();
                eggsLabelWeeklyPercent.push(myDate);
            }

            if (percentMax < weeklyAllPercent) {
                percentMax = weeklyAllPercent;
            }

            if (!isNaN(weeklyAllPercent)) {
                eggDataWeeklyAllPercent.push(weeklyAllPercent);
            }
        }

        const eggDataWeeklyAllPercentn = eggDataWeeklyAllPercent.reverse();

        const eggLabelWeeklyPercentn = eggsLabelWeeklyPercent.reverse();

        const totalWeeklyPercentage = {
            labels: eggLabelWeeklyPercentn,
            datasets: [
                {
                    label: 'Total Weekly Percentage',
                    data: eggDataWeeklyAllPercentn,
                    borderColor: ['rgba(255, 255, 0, 0.2)'],
                    backgroundColor: ['rgba(255, 255, 0, 0.2)'],
                    pointBackgroundColor: 'rgba(255, 255, 0, 0.2)'
                }
            ]
        }

        const totalWeeklyPercentOption = {
            title: {
                display: true,
                fontSize: 20,
                fontColor: '#000000',
                text: 'Total Weekly Laying Percentage'
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
                    },
                ]
            }
        }

        return (
            <Line data={totalWeeklyPercentage} options={totalWeeklyPercentOption}/>
        );
    } else {
        return (
            <div/>
        )
    }
}

export default TotalWeekly;