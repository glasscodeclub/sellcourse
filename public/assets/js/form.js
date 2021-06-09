const toggleForm = (target) => {
	if (target === 'register') {
		$("form").html(`
			<div class="form-group">
		    	<label for="name">Name</label>
		    	<input type="name" class="form-control" id="name">
		  	</div>
		  	<div class="form-group">
		    	<label for="email">Email</label>
		    	<input type="email" class="form-control" id="email">
		  	</div>
		  	<div class="form-group">
		    	<label for="password">Password</label>
		    	<input type="password" class="form-control" id="password">
		  	</div>
		  	<div class="form-group">
		    	<label for="re_password">Repeat Password</label>
		    	<input type="password" class="form-control" id="re_password">
		  	</div>
		  	<div class="form-group form-check">
		    	<input type="checkbox" class="form-check-input" id="">
		    	<label class="form-check-label" for="">Accept Terms and Conditions</label>
		  	</div>
		  	<button type="submit" class="btn btn-success">Make A New Account</button>
		`);

		isLogin = false;
		$('#register').removeClass('btn-outline-secondary');
		$('#register').addClass('btn-secondary');
		$('#login').removeClass('btn-secondary');
		$('#login').addClass('btn-outline-secondary');
		if (window.innerWidth > '600') {
			$('.img-section').css('height', '108vh');
		}
		else{
			$('.img-section').css('height', '60vh');
		}
		document.title = "Register"
		history.replaceState('register', 'Register', '/register.html');
	}
	else if (target === "login"){
		$("form").html(`
			<div class="form-group">
		    	<label for="email">Email</label>
		    	<input type="email" class="form-control" id="email">
		  	</div>
		  	<div class="form-group">
		    	<label for="password">Password</label>
		    	<input type="password" class="form-control" id="password">
		  	</div>
			<div class="form-group form-check">
		    	<input type="checkbox" class="form-check-input" id="remember-me">
		    	<label class="form-check-label" for="remember-me">Remember Me</label>
		  	</div>
		  	<button type="submit" class="btn btn-success">Log Into Your Account</button>
		`);
		isLogin = true;
		$('#register').addClass('btn-outline-secondary');
		$('#register').removeClass('btn-secondary');
		$('#login').addClass('btn-secondary');
		$('#login').removeClass('btn-outline-secondary');
		if (window.innerWidth > '600') {
			$('.img-section').css('height', '100vh');
		}
		else{
			$('.img-section').css('height', '60vh');
		}
		document.title = "Login"
		history.replaceState('login', 'Login', '/login.html');
	}
}

