import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  todoCollectionRef: AngularFirestoreCollection<any>;

  constructor(private db: AngularFirestore) {
    this.todoCollectionRef = this.db.collection<any>('todos');
  }
}
