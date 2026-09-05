import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export enum UserType {
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  username!: string;

  @Column({ type: "varchar", unique: true })
  email!: string;

  @Column({ type: "varchar" })
  usertype!: UserType;

  @Column({ type: "varchar" })
  password!: string;

  @Column({ type: "boolean", default: true })
  status!: boolean;

  @Column({ type: "int", nullable: true })
  created_by!: number | null;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;
}
