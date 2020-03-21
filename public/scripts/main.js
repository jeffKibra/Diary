function hoverin(element){
		element.style.backgroundColor="#80ffd4";
	}
	function hoverout(element){
		element.style.backgroundColor="black";
	}
	
	
	function topNav(element, color){
			//hide all elements with class tabcontent by default
			var i, buttons;
			
			//remove background color of all tablinks and buttons
			buttons=document.getElementsByClassName("button");
			for(i=0;i<buttons.length;i++){
				buttons[i].style.backgroundColor="";
			}
			//show the specific tab content
			document.getElementById("content").style.backgroundColor=color;
			document.getElementById("main-btn").style.backgroundColor=color;
			//add the specific color to the button used to open the tab content
			element.style.backgroundColor=color;
		}
		//get the element with id of defaultOpen and click on it
		//document.getElementById("defaultOpen").click();
		//document.getElementById("defaultOpen").click();


		//when user scrolls the page
		window.onscroll=function(){stickyNav()};
		//get the navbar
		var navigation=document.getElementById("navigation");
		//get the offset position of navbar
		var sticky=navigation.offsetTop;
		//add sticky class when you reach scroll position
		//remove sticky when you leave scroll position
		function stickyNav(){
			if(window.pageYOffset >= sticky){
				navigation.classList.add("sticky");
				
			}else{
				navigation.classList.remove("sticky");
				
			}
		}

		/*sidenav*/
		//menu icon changer
		function sideBarToggle(){
			
			var mainBtn=document.getElementById("main-btn");
				mainBtn.classList.toggle("change");
			if(mainBtn.classList.contains("change")){
				if(window.innerWidth<768){
					document.getElementById("navbar").style.height="200px";

				}else{
					document.getElementById("navbar").style.height="50px";
				}
				
			}else{
				document.getElementById("navbar").style.height="0";
			//	document.getElementById("content").style.marginTop="0";
				
			}
			
			//document.getElementById("content").style.marginTop="200px";

			//document.getElementById("main").style.padding="0";
			//without opacity
			//document.body.style.backgroundColor="rgba(0,120,85,0.4)";
		}
	