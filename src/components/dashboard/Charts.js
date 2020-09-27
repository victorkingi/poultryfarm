import React from "react";
import {Line} from "react-chartjs-2";

function Charts({profit, eggs}) {

    const eggsDataA1 = [];
    const eggsDataA2 = [];
    const eggsDataB1 = [];
    const eggsDataB2 = [];
    const eggsDataC1 = [];
    const eggsDataC2 = [];
    const eggsDataHouse = [];
    const eggsDatabroken = [];
    const eggDataTotal = [];
    const eggDataWeeklyAllPercent = [];
    const eggDataWeeklyCagePercent = [];
    const eggDataWeeklyHousePercent = [];
    const eggDataMonthlyAllPercent = [];
    const eggDataMonthlyCagePercent = [];
    const eggDataMonthlyHousePercent = [];
    const profitAmounts = [];

    const eggsLabel = [];
    const eggsLabelWeeklyPercent = [];
    const eggsLabelMonthlyPercent = [];
    const profitLabel = [];
    let max = 0;
    let totalMax = 0;
    let percentMax = 0;
    let profitMax = 0;
    let profitMin = 0;

    if (eggs && profit) {
        for (let i = 0; i < eggs['length']; i++) {
            const a1 = parseInt(eggs[i.toString()]["A 1"]);
            const a2 = parseInt(eggs[i.toString()]["A 2"]);
            const b1 = parseInt(eggs[i.toString()]["B 1"]);
            const b2 = parseInt(eggs[i.toString()]["B 2"]);
            const c1 = parseInt(eggs[i.toString()]["C 1"]);
            const c2 = parseInt(eggs[i.toString()]["C 2"]);
            const house = parseInt(eggs[i.toString()]["house"]);
            const broken = parseInt(eggs[i.toString()]["broken"]);
            const total = a1 + a2 + b1 + b2 + c1 + c2 + house;

            //percentages
            const weeklyAllPercent = parseInt(eggs[i.toString()]["weeklyAllPercent"]);
            const weeklyCagePercent = parseInt(eggs[i.toString()]["weeklyCagePercent"]);
            const weeklyHousePercent = parseInt(eggs[i.toString()]["weeklyHousePercent"]);
            const monthlyAllPercent = parseInt(eggs[i.toString()]["monthlyAllPercent"]);
            const monthlyCagePercent = parseInt(eggs[i.toString()]["monthlyCagePercent"]);
            const monthlyHousePercent = parseInt(eggs[i.toString()]["monthlyHousePercent"]);

            if (!isNaN(weeklyAllPercent)) {
                const myDate = eggs[i.toString()].date.toDate().toLocaleDateString();
                eggsLabelWeeklyPercent.push(myDate);
            }

            if (!isNaN(monthlyAllPercent)) {
                const myDate = eggs[i.toString()].date.toDate().toLocaleDateString();
                eggsLabelMonthlyPercent.push(myDate);
            }

            if (percentMax < weeklyAllPercent) {
                percentMax = weeklyAllPercent;
            }

            if (percentMax < monthlyAllPercent) {
                percentMax = monthlyAllPercent;
            }

            if (max < a1) {
                max = a1;
            }
            if (max < a2) {
                max = a2;
            }
            if (max < b1) {
                max = b1;
            }
            if (max < b2) {
                max = b2;
            }
            if (max < c1) {
                max = c1;
            }
            if (max < c2) {
                max = c2;
            }
            if (max < house) {
                max = house;
            }
            if (totalMax < total) {
                totalMax = total;
            }

            eggsDataA1.push(a1);
            eggsDataA2.push(a2);
            eggsDataB1.push(b1);
            eggsDataB2.push(b2);
            eggsDataC1.push(c1);
            eggsDataC2.push(c2);
            eggsDataHouse.push(house);
            eggsDatabroken.push(broken);
            eggDataTotal.push(total);

            if (!isNaN(weeklyAllPercent)) {
                eggDataWeeklyAllPercent.push(weeklyAllPercent);
            }
            if (!isNaN(weeklyCagePercent)) {
                eggDataWeeklyCagePercent.push(weeklyCagePercent);
            }
            if (!isNaN(weeklyHousePercent)) {
                eggDataWeeklyHousePercent.push(weeklyHousePercent);
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

        for (let p = 0; p < eggs['length']; p++) {
            const date = eggs[p.toString()].date.toDate().toLocaleDateString();
            eggsLabel.push(date);

        }

        for (let j = 0; j < profit['length']; j++) {
            const _profit = profit[j.toString()].time === 'Weekly' ? parseInt(profit[j.toString()]["profit"]) : false;
            _profit && profitAmounts.push(_profit);
            if (profitMax < _profit) {
                profitMax = _profit;
            }
            if (profitMin > _profit) {
                profitMin = _profit;
            }
        }

        for (let k = 0; k < profit['length']; k++) {
            const profitDate = profit[k.toString()].time === 'Weekly' ? profit[k.toString()].submittedOn.toDate().toLocaleDateString() : false;
            profitDate && profitLabel.push(profitDate);
        }


        // all data reversed so as to match the graph direction
        const eggsDataA1n = eggsDataA1.reverse();
        const eggsDataA2n = eggsDataA2.reverse();
        const eggsDataB1n = eggsDataB1.reverse();
        const eggsDataB2n = eggsDataB2.reverse();
        const eggsDataC1n = eggsDataC1.reverse();
        const eggsDataC2n = eggsDataC2.reverse();
        const eggsDataHousen = eggsDataHouse.reverse();
        const eggsDatabrokenn = eggsDatabroken.reverse();
        const eggDataTotaln = eggDataTotal.reverse();
        const eggDataWeeklyAllPercentn = eggDataWeeklyAllPercent.reverse();
        const eggDataWeeklyCagePercentn = eggDataWeeklyCagePercent.reverse();
        const eggDataWeeklyHousePercentn = eggDataWeeklyHousePercent.reverse();
        const eggDataMonthlyAllPercentn = eggDataMonthlyAllPercent.reverse();
        const eggDataMonthlyCagePercentn = eggDataMonthlyCagePercent.reverse();
        const eggDataMonthlyHousePercentn = eggDataMonthlyHousePercent.reverse();
        const profitAmountsn = profitAmounts.reverse();


        const eggLabeln = eggsLabel.reverse();
        const eggLabelWeeklyPercentn = eggsLabelWeeklyPercent.reverse();
        const eggLabelMonthlyPercentn = eggsLabelMonthlyPercent.reverse();
        const profitLabeln = profitLabel.reverse();

        const profitData = {
            labels: profitLabeln,
            datasets: [
                {
                    label: 'Profit/Loss',
                    data: profitAmountsn,
                    borderColor: ['rgba(0, 255, 0, 0.2)'],
                    backgroundColor: ['rgba(0, 255, 0, 0.2)'],
                    pointBackgroundColor: 'rgba(0, 255, 0, 0.2)'
                }
            ]
        }

        const profitOptions = {
            title: {
                display: true,
                fontSize: 20,
                fontColor: '#000000',
                text: 'Weekly Profit'
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
                            min: profitMin,
                            max: profitMax,
                            stepSize: 10000
                        }
                    },
                ]
            }
        }

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
                            max: totalMax,
                            stepSize: 100
                        }
                    },
                ]
            }
        }

        const totalEggs = {
            labels: eggLabeln,
            datasets: [
                {
                    label: 'Total eggs',
                    data: eggDataTotaln,
                    borderColor: ['rgba(255, 255, 0, 0.2)'],
                    backgroundColor: ['rgba(255, 255, 0, 0.2)'],
                    pointBackgroundColor: 'rgba(255, 255, 0, 0.2)'
                }
            ]
        }

        const totalEggsOption = {
            title: {
                display: true,
                fontSize: 20,
                fontColor: '#000000',
                text: 'Total Eggs against time'
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
                            max: totalMax,
                            stepSize: 100
                        }
                    }
                ]
            }
        }

        const eachLevel = {
            labels: eggLabeln,
            datasets: [
                {
                    label: 'A 1',
                    data: eggsDataA1n,
                    borderColor: ['rgba(255, 0, 0, 0.2)'],
                    backgroundColor: ['rgba(255, 0, 0, 0.2)'],
                    pointBackgroundColor: 'rgba(255, 0, 0, 0.2)'
                },
                {
                    label: 'A 2',
                    data: eggsDataA2n,
                    borderColor: ['rgba(0, 0, 255, 0.2)'],
                    backgroundColor: ['rgba(0, 0, 255, 0.2)'],
                    pointBackgroundColor: 'rgba(0, 0, 255, 0.2)'
                },
                {
                    label: 'B 1',
                    data: eggsDataB1n,
                    borderColor: ['rgba(255, 69, 0, 0.2)'],
                    backgroundColor: ['rgba(255, 69, 0, 0.2)'],
                    pointBackgroundColor: 'rgba(255, 69, 0, 0.2)'
                },
                {
                    label: 'B 2',
                    data: eggsDataB2n,
                    borderColor: ['rgba(34, 139, 34, 0.2)'],
                    backgroundColor: ['rgba(34, 139, 34, 0.2)'],
                    pointBackgroundColor: 'rgba(34, 139, 34, 0.2)'
                },
                {
                    label: 'C 1',
                    data: eggsDataC1n,
                    borderColor: ['rgba(0, 255, 0, 0.2)'],
                    backgroundColor: ['rgba(0, 255, 0, 0.2)'],
                    pointBackgroundColor: 'rgba(0, 255, 0, 0.2)'
                },
                {
                    label: 'C 2',
                    data: eggsDataC2n,
                    borderColor: ['rgba(255, 255, 0, 0.2)'],
                    backgroundColor: ['rgba(255, 255, 0, 0.2)'],
                    pointBackgroundColor: 'rgba(255, 255, 0, 0.2)'
                },
                {
                    label: 'House',
                    data: eggsDataHousen,
                    borderColor: ['rgba(255, 255, 255, 0.2)'],
                    backgroundColor: ['rgba(255, 255, 255, 0.2)'],
                    pointBackgroundColor: 'rgba(255, 255, 255, 0.2)'
                },
                {
                    label: 'Broken',
                    data: eggsDatabrokenn,
                    borderColor: ['rgba(148, 0, 211, 0.2)'],
                    backgroundColor: ['rgba(148, 0, 211, 0.2)'],
                    pointBackgroundColor: 'rgba(148, 0, 211, 0.2)'
                }
            ]
        }

        const eachLevelEggsOption = {
            title: {
                display: true,
                fontSize: 20,
                fontColor: '#000000',
                text: 'Number of eggs collected against time'
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
                            max: max,
                            stepSize: 20
                        }
                    }
                ]
            }
        }

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

        const monthlyPercentage = {
            labels: eggLabelMonthlyPercentn,
            datasets: [
                {
                    label: 'All Monthly Percentage',
                    data: eggDataMonthlyAllPercentn,
                    borderColor: ['rgba(255, 0, 0, 0.2)'],
                    backgroundColor: ['rgba(255, 0, 0, 0.2)'],
                    pointBackgroundColor: 'rgba(255, 0, 0, 0.2)'
                },
                {
                    label: 'Caged Monthly percentage',
                    data: eggDataMonthlyCagePercentn,
                    borderColor: ['rgba(0, 0, 255, 0.2)'],
                    backgroundColor: ['rgba(0, 0, 255, 0.2)'],
                    pointBackgroundColor: 'rgba(0, 0, 255, 0.2)'
                },
                {
                    label: 'House Monthly Percentage',
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
                text: 'Monthly Laying Percentage'
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
            <div>
                <Line data={profitData} options={profitOptions}/>
                <Line data={totalWeeklyPercentage} options={totalWeeklyPercentOption}/>
                <br/> <br/>

                <Line data={totalEggs} options={totalEggsOption}/>
                <br/> <br/>
                <Line data={weeklyPercentage} options={weeklyPercentOption}/>
                <br/> <br/>
                <Line data={monthlyPercentage} options={monthlyPercentOption}/>
                <br/> <br/>
                <Line data={eachLevel} options={eachLevelEggsOption}/>
                <br/> <br/>
            </div>
        );
    } else {
        return (
            <div/>
        )
    }
}

export default Charts;