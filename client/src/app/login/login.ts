import { Component, signal, computed } from "@angular/core";


@Component({
  selector: 'app-login',
  template: `
  <div class="login-container">
  <div class="login-card">
    <h2>Welcome Back</h2>

    <form (submit)="onLogin($event)">

      <label>Email</label>
      <input
        type="email"
        [value]="email()"
        (input)="onEmail($event)"
      />
      @if (!passwordRequired()) {
        <div class="error">Password is required</div>
      }

      <label>Password</label>
      <input
        type="password"
        [value]="password()"
        (input)="onPassword($event)"
      />
      @if (!emailRequired()) {
        <div class="error">Email is required</div>
      }

      <button type="submit">Login</button>
    </form>

    <p class="signup-link">
      Don't have an account?
      <a routerLink="/signup">Create one</a>
    </p>
  </div>
</div>

  `,
  styles: [`
    
    .login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F5F2E8; 
}

.login-card {
  width: 380px;
  padding: 40px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  border: 1px solid #ddd;
}

h2 {
  text-align: center;
  margin-bottom: 25px;
  font-weight: 600;
}

label {
  display: block;
  margin-top: 15px;
  font-size: 14px;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px;
  margin-top: 6px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 15px;
}

button {
  width: 100%;
  margin-top: 25px;
  padding: 12px;
  background-color: #2C2C2C;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background-color: #1F1F1F;
}

.error {
  color: #b00020;
  font-size: 13px;
  margin-top: 4px;
}

.signup-link {
  text-align: center;
  margin-top: 20px;
}

.signup-link a {
  color: #2C2C2C;
  font-weight: 600;
}

    `]
})

export class AppLogin{
  email = signal('')
  password = signal('')

  emailRequired = computed(() => this.email().trim().length > 0);
passwordRequired = computed(() => this.password().trim().length > 0);

  onEmail(event: Event) {
    const userEmail = (event.target as HTMLInputElement).value 
    this.email.set(userEmail)
  }

  onPassword(event: Event) {
    const passwordValue = (event.target as HTMLInputElement).value
    this.password.set(passwordValue)
  }

  onLogin(event: Event) {
    event.preventDefault()
    if (!this.emailRequired || !this.passwordRequired) {
      console.log(" missing fields ")
      return;
    }
    console.log("login successful ")
    //call API
  }
}