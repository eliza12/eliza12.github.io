var data = {
	name: "Eliza Rajbhandari",
	dateOfBirth: "1996 Feb 10",
	address: {
		permanent: "Bolachhen Tole, Bhaktapur",
		temporary: "Sinamangal, Kathmandu"
	},
	email: "eliza.rajbhandari@gmail.com",
	phone: "9860xxxxxx",
	education: {
		slc: "Babylon National School",
		plus2: "Global College of Management",
		bachelor: "St. Xavier's College"
	},
	experience: {
		position: "Intern",
		organization: "LIS Nepal Pvt. Ltd.",
		duration: "2 and half months"
	}
};

var mainContainer = document.getElementById("main-container");

init();

function init() {
	var container = document.createElement("div");
	container.style.width = "800px";
	container.style.margin = "auto";
	mainContainer.appendChild(container);

	var name = document.createElement("h1");
	name.innerHTML = data.name;
	name.style.textAlign = "center";
	container.appendChild(name);

	var email = document.createElement("p");
	email.innerHTML = "Email: "+data.email;
	container.appendChild(email);

	var phone = document.createElement("p");
	phone.innerHTML = "Phone: "+data.phone;
	container.appendChild(phone);

	var dob = document.createElement("p");
	dob.innerHTML = "Date of birth: "+data.dateOfBirth;
	container.appendChild(dob);

	var addTitle = document.createElement("h2");
	addTitle.innerHTML = "Address";
	addTitle.style.borderBottom = "2px solid black";
	container.appendChild(addTitle);

	var address = document.createElement("p");
	address.innerHTML = "Current address: "+data.address.temporary+"<br> Permanent address: "+data.address.permanent;
	container.appendChild(address);

	var education = document.createElement("div");
	container.appendChild(education);

	var eduTitle = document.createElement("h2");
	eduTitle.innerHTML = "Education";
	eduTitle.style.borderBottom = "2px solid black";
	education.appendChild(eduTitle);

	var slc = document.createElement("p");
	slc.innerHTML = "SLC: "+data.education.slc;
	education.appendChild(slc);

	var plus2 = document.createElement("p");
	plus2.innerHTML = "+2: "+data.education.plus2;
	education.appendChild(plus2);

	var bachelor = document.createElement("p");
	bachelor.innerHTML = "Bachelor: "+data.education.bachelor;
	education.appendChild(bachelor);

	var experience = document.createElement("div");
	container.appendChild(experience);

	var expTitle = document.createElement("h2");
	expTitle.innerHTML = "Experience";
	expTitle.style.borderBottom = "2px solid black";
	experience.appendChild(expTitle);

	var position = document.createElement("p");
	position.innerHTML = "Position: "+data.experience.position;
	experience.appendChild(position);

	var organization = document.createElement("p");
	organization.innerHTML = "Organization: "+data.experience.organization;
	experience.appendChild(organization);

	var duration = document.createElement("p");
	duration.innerHTML = "Duration: "+data.experience.duration;
	experience.appendChild(duration);
}