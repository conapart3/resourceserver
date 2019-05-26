package com.conal.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

// this would normally be stored in database for simplification we just returning a new one of these
@Data
@AllArgsConstructor
public class Foo
{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String name;
}
