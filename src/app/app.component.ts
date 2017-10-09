import { Component } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

export interface Todo {
    id?: string;
    completed: boolean;
    description: string;
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
    this.todoCollectionRef = this.db.collection<any>('items');
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
      this.fieldValue = todo.description;
      this.todoCollectionRef.doc(todo.id).update({ description: todo.description, completed: todo.completed });
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
      this.todoCollectionRef.add({ description: todoDesc, completed: false });
    }
  }
  updateTodo(desc) {
    if (desc) {
      desc = desc.trim();
      if (this.editingTodo) {
        this.editTodo(desc);
      } else {
        this.addTodo(desc);
      }
    }
    this.hideDialog();
  }

  editTodo(desc:string){
    console.log(desc);
    this.editingTodo.description = desc;
  }
  
  deleteTodo(todo: Todo) {
    this.todoCollectionRef.doc(todo.id).delete();
  }
}
