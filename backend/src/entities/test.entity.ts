import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export enum TestStatus {
  CREATED = "CREATED",
  REGISTRATION_STARTED = "REGISTRATION_STARTED",
  REGISTRATION_COMPLETE = "REGISTRATION_COMPLETE",
  TEST_STARTED = "TEST_STARTED",
  TEST_COMPLETE = "TEST_COMPLETE",
  RESULT_DECLARED = "RESULT_DECLARED",
  CANCELLED = "CANCELLED",
}

@Entity("tests")
export class Test {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  title!: string;

  @Column({ type: "simple-array" })
  subjects!: number[];

  @Column({ type: "simple-array" })
  questions!: number[];

  @Column({ type: "simple-array", nullable: true })
  answers!: string[];

  @Column({ type: "int" })
  maxmarks!: number;

  @Column({ type: "simple-array", nullable: true })
  que_types!: number[];

  @Column({ type: "timestamp", nullable: true })
  start_time!: Date | null;

  @Column({ type: "timestamp" })
  end_time!: Date;

  @Column({ type: "int" })
  duration!: number;

  @Column({ type: "timestamp" })
  reg_start_time!: Date;

  @Column({ type: "timestamp" })
  reg_end_time!: Date;

  @Column({ type: "timestamp" })
  result_time!: Date;

  @Column({ type: "varchar", default: TestStatus.CREATED })
  status!: TestStatus;

  @Column({ type: "int" })
  created_by!: number;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;
}