function createSpinny(tableSize, ringSize, parentElement) {
	function makeNewRing(size) {
		const newRingDiv = document.createElement("div");
		newRingDiv.classList.add("ring");
		newRingDiv.style.setProperty("--size", `${size}rem`);
		if (size <= 5) {
			newRingDiv.classList.add("center");
		}
		return newRingDiv;
	}

	let currentRing = parentElement;

	for (let i = tableSize; i > 0; i -= ringSize) {
		if (i === tableSize) {
			table.style.width = `${i}rem`;
		} else {
			const newRing = makeNewRing(i);
			currentRing.appendChild(newRing);
			currentRing = newRing;
		}
	}
}
function setAnimation(dur, colors, r) {
	const colorsList = colors.join(", ");
	r.style.setProperty("--ring-animation", `spin ${dur}s linear infinite`);
	r.style.setProperty("--ring-gradient", `conic-gradient(${colorsList})`);
}
function setStyle(rings, styles) {
	rings.forEach((ring) => {
		for (const key in styles) {
			ring.style[key] = styles[key];
		}
	});
}

const setColors = {
	lightPurple: "#cd84f1",
	darkPurple: "#c56cf0",
	lightPink: "#ffcccc",
	darkPink: "#ffb8b8",
	lightRed: "#ff4d4d",
	darkRed: "#ff3838",
	lightOrange: "#ffaf40",
	darkOrange: "#ff9f1a",
	lightYellow: "#fffa65",
	darkYellow: "#fff200",
	lightGreen: "#32ff7e",
	darkGreen: "#3ae374",
	lightTeal: "#7efff5",
	darkTeal: "#67e6dc",
	lightBlue: "#18dcff",
	darkBlue: "#17c0eb",
	lightInd: "#7d5fff",
	darkInd: "#7158e2",
	lightGrey: "#4b4b4b",
	darkGrey: "#3d3d3d"
};
const spinnyColors = [setColors.lightGreen, setColors.darkInd];

const table = document.getElementById("table");
createSpinny(75, 5, table);

const root = document.querySelector(":root");
setAnimation(20, spinnyColors, root);

const allRings = document.querySelectorAll(".ring");
setStyle(allRings, {
	border: "1px solid white",
	opacity: ".9"
});