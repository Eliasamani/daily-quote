import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

interface ViewContract {
  onLoginSuccess(): void;
  onError(error: string): void;
}

export default class LoginPresenter {
  constructor(private view: ViewContract) {}

  login(email: string, password: string) {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => this.view.onLoginSuccess())
      .catch(err => this.view.onError(err.message));
  }

  register(email: string, password: string) {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => this.view.onLoginSuccess())
      .catch(err => this.view.onError(err.message));
  }
}