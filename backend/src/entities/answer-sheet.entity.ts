import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("answer_sheets")
export class AnswerSheet {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  test_id!: number;

  @Column({ type: "int" })
  student_id!: number;

  @Column({ type: "int", default: 0 })
  score!: number;

  @Column({ type: "simple-array", nullable: true })
  answers!: string[];

  @Column({ type: "timestamp", nullable: true })
  start_time!: Date | null;

  @Column({ type: "boolean", default: false })
  completed!: boolean;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;
}