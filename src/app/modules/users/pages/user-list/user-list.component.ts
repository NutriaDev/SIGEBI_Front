import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = false;

  constructor(
    private usersService: UsersService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;

    this.usersService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response.body; // ✅ totalmente tipado
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users', error);
        this.loading = false;
      },
    });
  }

  onEdit(user: User) {
    const encodedEmail = encodeURIComponent(user.email);
    this.router.navigate(['/users/edit', encodedEmail]);
  }
  // onDelete(id: number): void {
  //   this.usersService.deleteUser(id).subscribe({
  //     next: () => {
  //       this.loadUsers();
  //     },
  //     error: (error) => {
  //       console.error('Error deleting user', error);
  //     },
  //   });
  // }
}
