package com.conal.controller;

import com.conal.entity.Foo;
import com.conal.repository.FooRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Controller
@Slf4j
@CrossOrigin
public class FooController
{
    private FooRepository fooRepository;

    public FooController(FooRepository fooRepository)
    {
        this.fooRepository = fooRepository;
    }

    // Foo would ideally be stored in database for simplification we just returning a new one of these
    @PreAuthorize("#oauth2.hasScope('read')")
    @RequestMapping(method = RequestMethod.GET, value = "/foos/{id}")
    @ResponseBody
    public Foo findById(@PathVariable long id)
    {
        log.info("Finding foo with id: {}", id);
        Optional<Foo> foo = fooRepository.findById(id);

        if (foo.isPresent())
        {
            log.info("Foo found!");
            return foo.get();
        }
        log.info("Foo not found.");
        return new Foo(0, "FAKE FOO NOT EXISTING");
    }

    @PreAuthorize("#oauth2.hasScope('write')")
    @RequestMapping(method = RequestMethod.POST, value = "/addFoo")
    @ResponseBody
    public long addFoo(@PathVariable String name)
    {
        log.info("Adding Foo with name: {}", name);
        Foo savedFoo = fooRepository.save(new Foo(name));
        return savedFoo.getId();
    }
}
