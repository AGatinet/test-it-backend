const offers = [
	{
		offerName: "offre1"
	},
	{
		offerName: "offre3"
	},
	{
		offerName: "zozoz"
	}
];

const regex = new RegExp("of", "g");

const result = offers.filter(({ offerName }) => {
	return offerName.match(regex);
});

console.log(result);
