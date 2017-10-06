import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

export interface Todo {
    id?: string;
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

  showDialog = false;
  editingTodo: any = null;
  fieldValue = '';
  okButtonText = 'Crear Tarea';
  
  constructor(private db: AngularFirestore) {
    this.todoCollectionRef = this.db.collection<any>('todos');
    this.todo$ = this.todoCollectionRef.snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as Todo;
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    });
  }

  todoDialog(todo: Todo = null) {
    this.okButtonText = 'Crear Tarea';
    this.fieldValue = '';
    this.editingTodo = todo;
    if (todo) {
      this.fieldValue = todo.id;
      this.todoCollectionRef.doc(todo.id).update({ completed: !todo.completed });
      this.okButtonText = 'Editar';
    }
    this.showDialog = true;
  }

  hideDialog() {
    this.showDialog = false;
    this.editingTodo = null;
    this.fieldValue = null; // make sure Input is new
  }

  addTodo(todoDesc: string) {
    if (todoDesc && todoDesc.trim().length) {
      this.todoCollectionRef.add({ text: todoDesc, completed: false });
    }
  }
  updateTodo(todo: Todo) {
    this.todoCollectionRef.doc(todo.id).update({ completed: !todo.completed });
  }
  
  deleteTodo(todo: Todo) {
    this.todoCollectionRef.doc(todo.id).delete();
  }
}
