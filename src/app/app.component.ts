import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

export interface Todo {
  
    completed: boolean;
    text: string;
  }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  todoCollectionRef: AngularFirestoreCollection<Todo>;
  todo$: Observable<Todo[]>;
  
  constructor(private db: AngularFirestore) {
    this.todoCollectionRef = this.db.collection<any>('todos');
    this.todo$ = this.todoCollectionRef.valueChanges();
  }

  addTodo(todoDesc: string) {
    if (todoDesc && todoDesc.trim().length) {
      this.todoCollectionRef.add({ text: todoDesc, completed: false });
    }
  }
}
