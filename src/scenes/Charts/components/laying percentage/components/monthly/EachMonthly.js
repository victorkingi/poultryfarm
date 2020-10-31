import React from "react";
import {Line} from "react-chartjs-2";

function EachMonthly({eggs}) {

    const eggDataMonthlyAllPercent = [];
    const eggDataMonthlyCagePercent = [];
    const eggDataMonthlyHousePercent = [];

    const eggsLabelMonthlyPercent = [];

    let percentMax = 0;

    if (eggs) {
        for (let i = 0; i < eggs['length']; i++) {

            const monthlyAllPercent = parseInt(eggs[i.toString()]["monthAllPercent"]);
            const monthlyCagePercent = parseInt(eggs[i.toString()]["monthCagePercent"]);
            const monthlyHousePercent = parseInt(eggs[i.toString()]["monthHousePercent"]);

            if (!isNaN(monthlyAllPercent)) {
                const myDate = eggs[i.toString()].date.toDate().toLocaleDateString();
                eggsLabelMonthlyPercent.push(myDate);
            }

            if (percentMax < monthlyCagePercent) {
                percentMax = monthlyCagePercent;
            }
            if (percentMax < monthlyHousePercent) {
                percentMax = monthlyHousePercent;
            }
            if (percentMax < monthlyAllPercent) {
                percentMax = monthlyAllPercent;
            }

            if (!isNaN(monthlyAllPercent)) {
                eggDataMonthlyAllPercent.push(monthlyAllPercent);
            }
            if (!isNaN(monthlyCagePercent)) {
                eggDataMonthlyCagePercent.push(monthlyCagePercent);
            }
            if (!isNaN(monthlyHousePercent)) {
                eggDataMonthlyHousePercent.push(monthlyHousePercent);
            }

        }

        const eggDataMonthlyAllPercentn = eggDataMonthlyAllPercent.reverse();
        const eggDataMonthlyCagePercentn = eggDataMonthlyCagePercent.reverse();
        const eggDataMonthlyHousePercentn = eggDataMonthlyHousePercent.reverse();

        const eggLabelMonthlyPercentn = eggsLabelMonthlyPercent.reverse();

        const monthlyPercentage = {
            labels: eggLabelMonthlyPercentn,
            datasets: [
                {
                    label: 'All EachMonthly Percentage',
                    data: eggDataMonthlyAllPercentn,
                    borderColor: ['rgba(0, 255, 0, 0.2)'],
                    backgroundColor: ['rgba(0, 255, 0, 0.2)'],
                    pointBackgroundColor: 'rgba(0, 255, 0, 0.2)'
                },
                {
                    label: 'Caged EachMonthly percentage',
                    data: eggDataMonthlyCagePercentn,
                    borderColor: ['rgba(0, 0, 255, 0.2)'],
                    backgroundColor: ['rgba(0, 0, 255, 0.2)'],
                    pointBackgroundColor: 'rgba(0, 0, 255, 0.2)'
                },
                {
                    label: 'House EachMonthly Percentage',
                    data: eggDataMonthlyHousePercentn,
                    borderColor: ['rgba(255, 69, 0, 0.2)'],
                    backgroundColor: ['rgba(255, 69, 0, 0.2)'],
                    pointBackgroundColor: 'rgba(255, 69, 0, 0.2)'
                }
            ]
        }

        const monthlyPercentOption = {
            title: {
                display: true,
                fontSize: 20,
                fontColor: '#000000',
                text: 'EachMonthly Laying Percentage'
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
            <Line data={monthlyPercentage} options={monthlyPercentOption}/>
        );
    } else {
        return (
            <div/>
        )
    }
}

export default EachMonthly;