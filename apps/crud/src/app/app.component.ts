import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { randText } from '@ngneat/falso';
import { TodosService } from './todos.service';
import { ITodo } from './todo.model';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-root',
  template: `
    <div *ngFor="let todo of $todos | async">
      {{ todo.title }}
      <button (click)="update(todo)">Update</button>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  todoService = inject(TodosService);

  $todos: Observable<ITodo[]> = this.todoService.todos;

  constructor() {}

  ngOnInit(): void {
    this.todoService.getAllTodos();
  }

  update(todo: ITodo) {
    this.todoService.putTodo(todo);
  }
}
