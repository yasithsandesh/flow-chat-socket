import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("chat")
export class Chat{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    message:string

    @CreateDateColumn()
    date_time:Date

    @Column('int')
    user_from_id:number

    @Column('int')
    user_to_id:number

    @Column('int')
    status_id:number
}

// @Id
// @Column(name = "id")
// @GeneratedValue(strategy = GenerationType.AUTO)
// private int id;

// @Column(name = "message", nullable = false)
// private String message;

// @Column(name = "date_time", nullable = false)
// private Date dateTime;

// @ManyToOne
// @JoinColumn(name = "user_from_id")
// private User fromUser;

// @ManyToOne
// @JoinColumn(name = "user_to_id")
// private User toUser;

// @ManyToOne
// @JoinColumn(name = "status_id")
// private Status status;