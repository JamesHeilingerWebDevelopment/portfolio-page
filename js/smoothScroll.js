/** @format */

// Animate smooth scroll

$("#nav-home").on('click', function () {
  const pos = $("#showcase").position().top;

  $("html, body").animate(
    {
      scrollTop: pos,
    },
    900
  );
});

$("#nav-projects").on('click', function () {
  const pos = $("#projects").position().top - 72;

  $("html, body").animate(
    {
      scrollTop: pos,
    },
    900
  );
});

$("#nav-about-me").on('click', function () {
  const pos = $("#about-me").position().top - 72;

  $("html, body").animate(
    {
      scrollTop: pos,
    },
    900
  );
});

$("#nav-tech").on('click', function () {
  const pos = $("#technologies").position().top - 71;

  $("html, body").animate(
    {
      scrollTop: pos,
    },
    900
  );
});

$("#nav-contact").on('click', function () {
  const pos = $("#contact").position().top - 72;

  $("html, body").animate(
    {
      scrollTop: pos,
    },
    900
  );
});
