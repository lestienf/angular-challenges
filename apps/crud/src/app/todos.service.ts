import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable } from 'rxjs';
import { ITodo } from './todo.model';
import { randText } from '@ngneat/falso';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  baseUrl: string = 'https://jsonplaceholder.typicode.com';

  todoList: BehaviorSubject<ITodo[]> = new BehaviorSubject<ITodo[]>([]);
  destroyRef = inject(DestroyRef);

  http = inject(HttpClient);

  constructor() {}

  public getAllTodos(): void {
    this.http
      .get<ITodo[]>(this.baseUrl + '/todos')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((todos) => {
        this.todoList.next(todos);
      });
  }

  public putTodo(todo: ITodo): void {
    const json: string = JSON.stringify({
      todo: todo.id,
      title: randText(),
      body: todo.body,
      userId: todo.userId,
    });
    this.http
      .put<ITodo>(this.baseUrl + `/todos/` + todo.id, json, {
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((todoUpdated) => {
        const initialPosition = this.indexOfTodo(todoUpdated);
        const actualList = this.todoList
          .getValue()
          .filter((t) => t.id !== todoUpdated.id);
        const newList = [
          ...this.insertOnIndex(actualList, initialPosition, todoUpdated),
        ];
        this.todoList.next(newList);
      });
  }

  public get todos() {
    return this.todoList.asObservable();
  }

  private indexOfTodo(item: ITodo): number {
    return this.todoList
      .getValue()
      .map((t) => t.id)
      .indexOf(item.id);
  }

  private insertOnIndex(array: any[], index: number, newItem: any): any[] {
    return [...array.slice(0, index), newItem, ...array.slice(index)];
  }
}
