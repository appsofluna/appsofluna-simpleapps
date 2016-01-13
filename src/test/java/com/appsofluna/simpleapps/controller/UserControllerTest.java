/*
 * Copyright (c) 2016 AppsoFluna.
 * All rights reserved.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
package com.appsofluna.simpleapps.controller;

import com.appsofluna.simpleapps.Application;
import com.appsofluna.simpleapps.model.User;
import com.appsofluna.simpleapps.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hamcrest.Matcher;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestContext;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import static org.hamcrest.Matchers.*;
import org.mockito.Mockito;
import static org.mockito.Mockito.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.hateoas.MediaTypes;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultMatcher;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

/**
 *
 * @author Charaka Gunatillake <charakajg[at]gmail[dot]com>
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
public class UserControllerTest {
    
    @Autowired WebApplicationContext context; 
    
    private MockMvc mockMvc;
 
    @Autowired
    private UserService userServiceMock;
    
    @Before
    public void setUp() {
        Mockito.reset(userServiceMock);
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.context).build();
    }

    /**
     * Test of createUser method, of class UserController.
     */
    @Test
    public void testCreateUser() throws JsonProcessingException, Exception {
        System.out.println("createUser");
        User returnUser = new User();
        String TEST_USER_NAME = "testuname";
        returnUser.setUsername(TEST_USER_NAME);
        returnUser.setPassword("pwd");
        returnUser.setType("NQ");
        when(userServiceMock.createUser(TEST_USER_NAME,"testpwd", true)).thenReturn(returnUser);
         mockMvc.perform(post("/api/user/save")
                 .contentType(MediaType.APPLICATION_JSON.getType())
                .content(new ObjectMapper().writeValueAsBytes(returnUser)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON.getType()))
                .andExpect(jsonPath("$.username", is(TEST_USER_NAME)));
 
        verify(userServiceMock, times(1)).createUser(TEST_USER_NAME,"testpwd", true);
        verifyNoMoreInteractions(userServiceMock);
    }
    
}
