import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("questions")
export class Question {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text" })
  body!: string;

  @Column({ type: "text", nullable: true })
  explanation!: string | null;

  @Column({ type: "simple-array" })
  options!: string[];

  @Column({ type: "int" })
  subject!: number;

  @Column({ type: "varchar" })
  answer!: string;

  @Column({ type: "int" })
  marks!: number;

  @Column({ type: "boolean", default: true })
  status!: boolean;

  @Column({ type: "int", nullable: true })
  created_by!: number | null;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;
}