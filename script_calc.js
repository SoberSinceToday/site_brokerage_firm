var P, R, N, pie, line;
var loan_amt_slider = document.getElementById("loan-amount");
var int_rate_slider = document.getElementById("interest-rate");
var loan_period_slider = document.getElementById("loan-period");

// update loan amount
loan_amt_slider.addEventListener("input", (self) => {
	document.querySelector("#loan-amt-text").innerText =
		parseInt(self.target.value).toLocaleString("en-US") + "RUB";
	P = parseFloat(self.target.value);
	displayDetails();
});

// update Rate of Interest
int_rate_slider.addEventListener("input", (self) => {
	document.querySelector("#interest-rate-text").innerText =
		self.target.value + "%";
	R = parseFloat(self.target.value);
	displayDetails();
});

// update loan period
loan_period_slider.addEventListener("input", (self) => {
	if (self.target.value == 1) {
		document.querySelector("#loan-period-text").innerText = self.target.value + " год";
	}else if (self.target.value <= 4){
		document.querySelector("#loan-period-text").innerText = self.target.value + " года";
	}else{
		document.querySelector("#loan-period-text").innerText = self.target.value + " лет";
	}
	
		
		
	N = parseFloat(self.target.value);
	displayDetails();
});

// calculate total Interest payable
function calculateLoanDetails(p, r, emi) {
	/*
		p: principal
		r: rate of interest
		emi: monthly emi
	*/
	let totalInterest = 0;
	let yearlyInterest = [];
	let yearPrincipal = [];
	let years = [];
	let year = 1;
	let [counter, principal, interes] = [0, 0, 0];
	while (p > 0) {
		let interest = parseFloat(p) * parseFloat(r);
		p = parseFloat(p) - (parseFloat(emi) - interest);
		totalInterest += interest;
		principal += parseFloat(emi) - interest;
		interes += interest;
		if (++counter == 12) {
			years.push(year++);
			yearlyInterest.push(parseInt(interes));
			yearPrincipal.push(parseInt(principal));
			counter = 0;
		}
	}
	line.data.datasets[0].data = yearPrincipal;
	line.data.datasets[1].data = yearlyInterest;
	line.data.labels = years;
	return totalInterest;
}

// calculate details
function displayDetails() {
	let r = parseFloat(R) / 1200;
	let n = parseFloat(N) * 12;

	let num = parseFloat(P) * r * Math.pow(1 + r, n);
	let denom = Math.pow(1 + r, n) - 1;
	let emi = parseFloat(num) / parseFloat(denom);

	let payabaleInterest = calculateLoanDetails(P, r, emi);

	let opts = '{style: "decimal", currency: "US"}';

	document.querySelector("#cp").innerText =
		parseFloat(P).toLocaleString("ru-RU", opts) + " RUB";

	document.querySelector("#ci").innerText =
		parseFloat(payabaleInterest).toLocaleString("ru-RU", opts) + " RUB";

	document.querySelector("#ct").innerText =
		parseFloat(parseFloat(P) + parseFloat(payabaleInterest)).toLocaleString(
			"ru-RU",
			opts
		) + " RUB";

	document.querySelector("#price").innerText =
		parseFloat(emi).toLocaleString("en-US", opts) + " RUB";

	pie.data.datasets[0].data[0] = P;
	pie.data.datasets[0].data[1] = payabaleInterest;
	pie.update();
	line.update();
}

// Initialize everything
function initialize() {
	document.querySelector("#loan-amt-text").innerText =
		parseInt(loan_amt_slider.value).toLocaleString("en-US") + " RUB";
	P = parseFloat(document.getElementById("loan-amount").value);

	document.querySelector("#interest-rate-text").innerText =
		int_rate_slider.value + "%";
	R = parseFloat(document.getElementById("interest-rate").value);

	document.querySelector("#loan-period-text").innerText =
		loan_period_slider.value + " лет";
	N = parseFloat(document.getElementById("loan-period").value);

	line = new Chart(document.getElementById("lineChart"), {
		data: {
			datasets: [
				{
					type: "line",
					label: "Годовой основной взнос",
					borderColor: "rgb(25,158,252)",
					data: []
				},
				{
					type: "line",
					label: "Годовой процентный взнос",
					borderColor: "rgb(195, 193, 198)",
					data: []
				}
			],
			labels: []
		},
		options: {
			plugins: {
				title: {
					display: true,
					text: "График годовых платежей"
					
				}
			},
			scales: {
				x: {
					title: {
						color: "grey",
						display: true,
						text: "Срок"
					}
				},
				y: {
					title: {
						color: "grey",
						display: true,
						text: "Сумма"
					}
				}
			}
		}
	});

	pie = new Chart(document.getElementById("pieChart"), {
		type: "doughnut",
		data: {
			labels: ["Заем", "Проценты"],
			datasets: [
				{
					label: "Home Loan Details",
					data: [0, 0],
					backgroundColor: ["rgb(25,158,252)", "rgb(195, 193, 198)"],
					hoverOffset: 4
				}
			]
		},
		options: {
			plugins: {
				title: {
					display: true,
					text: "Кредитная диаграмма"
				}
			}
		}
	});
	displayDetails();
}
initialize();